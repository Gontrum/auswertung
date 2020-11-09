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

  const sortedData = data.map(d => ({
    ...d,
    Rang: parseInt(d.Rang, 10)
  }))
    .sort((a, b) => d3.descending(a.Rang, b.Rang))

  const svg = prepareSvg(selector)

  const xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(sortedData, d => d.Rang)])

  const yScale = d3.scaleBand()
    .range([0, height])
    .padding(0.4)
    .domain(sortedData.map(d => d.Methode))

  svg.append('g')
    .call(d3.axisLeft(yScale).tickSize(0).tickFormat((d, i) => `${i}. ${d}`))
    .attr('font-family', 'B612, sans-serif')
    .attr('font-size', '1em')
    .select('.domain')
    .remove()

  const elements = svg.selectAll('.bar')
    .data(sortedData)
    .enter()
    .append('g')
    .attr('class', 'searchme')

  elements
    .append('rect')
    .attr('x', 0)
    .attr('y', d => yScale(d.Methode))
    .attr('height', yScale.bandwidth())
    .attr('width', d => xScale(d.Rang))
    .attr('fill', '#2098a3')
    .attr('stroke', 'black')

  elements.append('text')
    .text(d => d.Rang)
    .attr('x', d => xScale(d.Rang) / 2)
    .attr('y', d => yScale(d.Methode) + (yScale.bandwidth() / 2) + 7)
    .attr('fill', 'white')
}
