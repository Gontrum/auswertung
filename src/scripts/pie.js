import * as d3 from 'd3'

export default (selector, data) => {
  const margin = {
    top: 10, right: 310, bottom: 30, left: 20
  }
  const width = 750 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  const radius = Math.min(width, height) / 2

  const sortedData = data.map(d => ({
    ...d,
    gewaehlt: parseInt(d.gewaehlt, 10)
  }))
    .sort((a, b) => d3.descending(a.gewaehlt, b.gewaehlt))

  const prepareSvg = svgSelector => d3.select(svgSelector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  const color = d3.scaleOrdinal()
    .domain(sortedData.map(d => d.paradigma))
    .range(d3.schemeSet1)

  const svg = prepareSvg(selector)
  const pie = d3.pie().value(d => d.gewaehlt)

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

  svg.selectAll('.pie')
    .data(pie(sortedData))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.paradigma))
    .attr('stroke', 'black')
    .attr('class', 'piepiece')

  const textG = svg.selectAll('.labels')
    .data(pie(sortedData))
    .enter().append('g')
    .attr('class', 'labels')

  const stimmenInsgesamt = sortedData.reduce((acc, curr) => acc + curr.gewaehlt, 0)
  const percent = d => Math.round((d.data.gewaehlt * 100) / stimmenInsgesamt)

  textG.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .attr('fill', 'black')
    .text(d => `${percent(d)}%`)

  const size = 20
  const legendG = svg.selectAll('.legend')
    .data(pie(sortedData))
    .enter().append('g')
    .attr('transform', `translate(${width / 2},0)`)
    .attr('class', 'legend')

  legendG.append('rect')
    .attr('x', 20)
    .attr('y', (_, i) => i * (size + 5))
    .attr('width', size)
    .attr('height', size)
    .attr('fill', d => color(d.data.paradigma))

  legendG.append('text')
    .text(d => `${d.value}: ${d.data.paradigma}`)
    .attr('fill', d => color(d.data.paradigma))
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
    .attr('font-family', 'B612, sans-serif')
    .attr('x', 20 + size * 1.2)
    .attr('y', (_, i) => i * (size + 5) + (size / 2))
}
