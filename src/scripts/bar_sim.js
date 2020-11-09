import * as d3 from 'd3'

export default (selector, data) => {
  const margin = {
    top: 10, right: 20, bottom: 30, left: 500
  }
  const width = 1050 - margin.left - margin.right
  const height = 650 - margin.top - margin.bottom

  const prepareSvg = svgSelector => d3.select(svgSelector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const data1 = data.map(d => ({
    ...d,
    Rang: parseInt(d.Rang, 10)
  })).sort((a, b) => d3.descending(a.Rang, b.Rang))

  const data2 = data.map(d => ({
    ...d,
    Rang: parseInt(d.Stimmen, 10)
  })).sort((a, b) => d3.descending(a.Rang, b.Rang))

  const svg = prepareSvg(selector)
  svg.append('g')
    .attr('class', 'axis')

  const drawFirstTime = (initialData) => {
    const xScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(initialData, d => d.Rang)])

    const yScale = d3.scaleBand()
      .range([0, height])
      .padding(0.4)
      .domain(initialData.map(d => d.Methode))

    svg.selectAll('.axis').call(d3.axisLeft(yScale).tickSize(0).tickFormat((d, i) => `${i}. ${d}`))
      .attr('font-family', 'B612, sans-serif')
      .attr('font-size', '1em')
      .select('.domain')
      .remove()

    const elements = svg.selectAll('.bar')
      .data(initialData)
      .enter()
      .append('g')
      .attr('class', 'element')

    elements.append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.Methode))
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(d.Rang))
      .attr('fill', '#2098a3')
      .attr('stroke', 'black')

    elements.append('text')
      .attr('class', 'anzahl')
      .text(d => d.Rang)
      .attr('x', d => xScale(d.Rang) / 2)
      .attr('y', d => yScale(d.Methode) + (yScale.bandwidth() / 2) + 7)
      .attr('fill', 'white')
  }

  const changeData = (changedData, color) => {
    const xScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(changedData, d => d.Rang)])

    const yScale = d3.scaleBand()
      .range([0, height])
      .padding(0.4)
      .domain(changedData.map(d => d.Methode))

    svg.selectAll('.axis')
      .transition()
      .duration(800)
      .call(d3.axisLeft(yScale).tickSize(0).tickFormat((d, i) => `${i}. ${d}`))
      .on('start', () => svg.select('.domain').remove())
      .attr('font-family', 'B612, sans-serif')
      .attr('font-size', '1em')
      .select('.domain')
      .remove()

    svg.selectAll('rect')
      .data(changedData)
      .transition()
      .duration(800)
      .attr('x', 0)
      .attr('y', d => yScale(d.Methode))
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(d.Rang))
      .attr('fill', color)
      .attr('stroke', 'black')

    svg.selectAll('.anzahl')
      .data(changedData)
      .transition()
      .duration(800)
      .text(d => d.Rang)
      .attr('x', d => xScale(d.Rang) / 2)
      .attr('y', d => yScale(d.Methode) + (yScale.bandwidth() / 2) + 7)
      .attr('fill', 'white')
  }

  drawFirstTime(data1)

  d3.select(`${selector} .withRange`)
    .on('click', () => changeData(data1, '#2098a3'))
  d3.select(`${selector} .withoutRange`)
    .on('click', () => changeData(data2, '#36F5AE'))
}
