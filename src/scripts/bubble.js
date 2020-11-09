import * as d3 from 'd3'

export default (selector, data) => {
  const margin = {
    top: 10, right: 520, bottom: 30, left: 50
  }
  const width = 1000 - margin.left - margin.right
  const height = 420 - margin.top - margin.bottom

  const erfahrungsWerte = [{ key: 'Viel Erfahrung (9-6)', value: 6 }, { key: 'Solide Erfahung (5-3)', value: 3 }, { key: 'Kaum Erfahrung (3-0)', value: 0 }]
  const color = d3.scaleOrdinal()
    .domain([0, 2])
    .range(d3.schemeSet1)

  const erfahrungColor = (routine) => {
    if (routine < 3) {
      return color(0)
    }
    if (routine < 6) {
      return color(1)
    }
    return color(2)
  }

  const addXScale = (svg) => {
    const xscale = d3.scaleLinear()
      .domain([0, 9])
      .range([0, width])
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xscale))

    // text label for the x axis
    svg.append('text')
      .attr('transform',
        `translate(${width / 2} ,${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Interesse Kunde')
  }

  const addYScale = (svg) => {
    const yscale = d3.scaleLinear()
      .domain([0, 9])
      .range([height, 0])
    svg.append('g')
      .call(d3.axisLeft(yscale))

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Interesse Devs')
  }

  const addLegend = (svg) => {
    const legendHolder = svg.append('g')
      .attr('transform', `translate(${margin.left + width},0)`)

    const size = 20
    const legend = legendHolder.selectAll('.legend')
      .data(erfahrungsWerte.slice().reverse())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (_, i) => `translate(0,${i * 20})`)

    legend.append('rect')
      .attr('x', 20)
      .attr('y', (_, i) => 100 + i * (size + 5))
      .attr('width', size)
      .attr('height', size)
      .style('fill', d => erfahrungColor(d.value))

    legend.append('text')
      .attr('x', 20 + size * 1.2)
      .attr('y', (_, i) => 100 + i * (size + 5) + (size / 2))
      .style('fill', d => erfahrungColor(d.value))
      .text(d => d.key)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('font-weight', 'bold')
  }

  const prepareSvg = (svgSelector) => {
    const svg = d3.select(svgSelector)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        `translate(${margin.left},${margin.top})`)
    return svg
  }

  const prepareTooltip = (tooltipSelector) => {
    const tooltip = d3.select(tooltipSelector)
      .append('div')
      .classed('tooltips', true)

    return tooltip
  }

  const createSimulation = () => {
    const simulation = d3.forceSimulation().force('collision', d3.forceCollide(7))
    simulation.stop()
    return simulation
  }

  const createNodes = (csvData) => {
    const x = d3.scaleLinear()
      .domain([0, 9])
      .range([0, width])
    const y = d3.scaleLinear()
      .domain([0, 9])
      .range([height, 0])

    return csvData.map(date => ({
      ...date,
      radius: 15,
      x: x(date.Kunden),
      y: y(date.Interesse)
    }))
  }

  const className = d => d.Thema.replace(/\W/g, '')

  const highlight = (d) => {
    d3.selectAll('.bubble').classed('deemphasized', true)
    d3.selectAll(`.${className(d)}`).classed('deemphasized', false)

    d3.selectAll(`.tooltip.${className(d)}`).classed('highlighted', true)
  }

  const removeHighlight = (d) => {
    d3.selectAll('.bubble').classed('deemphasized', false)
    d3.selectAll(`.tooltip.${className(d)}`).classed('highlighted', false)
  }

  const markItem = (d) => {
    d3.selectAll('.marked').classed('marked', false)
    d3.selectAll(`.tooltip.${className(d)}`).classed('marked', true)
    d3.selectAll(`.${className(d)}`).classed('marked', true)
  }

  const chart = (svgSelector, csvData) => {
    const tooltip = prepareTooltip(svgSelector)
    const svg = prepareSvg(svgSelector)
    addLegend(svg)
    addXScale(svg)
    addYScale(svg)

    const nodes = createNodes(csvData)

    nodes.forEach((currNode, i) => {
      tooltip.append('div')
        .html(`${i}. ${currNode.Thema}`)
        .attr('class', `tooltip ${className(currNode)}`)
        .on('mouseover', () => highlight(currNode))
        .on('mouseleave', () => removeHighlight(currNode))
        .on('click', () => markItem(currNode))
    })

    const elements = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')

    const bubbles = elements
      .append('circle')
      .attr('class', 'bubble')
      .attr('class', d => `bubble ${className(d)}`)
      .attr('r', d => d.radius)
      .attr('fill', d => erfahrungColor(d.Routine))
      .attr('stroke', 'black')
      .on('mouseover', (_, d) => highlight(d))
      .on('mouseleave', (_, d) => removeHighlight(d))
      .on('click', (_, d) => markItem(d))

    const texts = elements
      .append('text')
      .attr('dy', '.3em')
      .classed('bubbletext', true)
      .text((_, i) => i)
      .attr('font-family', 'sans-serif')
      .attr('font-size', d => d.radius)
      .attr('fill', 'white')
      .on('mouseover', (_, d) => highlight(d))
      .on('mouseleave', (_, d) => removeHighlight(d))
      .on('click', (_, d) => markItem(d))

    const ticked = (bubblesToMove, textsToMove) => {
      bubblesToMove
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      textsToMove
        .attr('x', d => d.x)
        .attr('y', d => d.y)
    }

    createSimulation().nodes(nodes)
      .on('tick', () => ticked(bubbles, texts))
      .restart()
  }

  return chart(selector, data)
}
