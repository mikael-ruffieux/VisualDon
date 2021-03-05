import {
  axisLeft,
  select,
  scaleLinear,
  max

} from 'd3'

import DATA from './fribourg'

DATA.sort((a, b) => a.productionPotentielle > b.productionPotentielle ? -1 : 1) // tri décroissant

const WIDTH = 1000
const HEIGHT = 600
const MARGIN = 3
const MARGIN_LEFT = 55
const MARGIN_BOTTOM = 150
const BAR_WIDTH = (WIDTH - MARGIN_LEFT) / DATA.length

const svg = select('body')
  .append('svg')
  .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

const yScale = scaleLinear()
  .domain([0, max(DATA, d => d.productionPotentielle)])
  .range([HEIGHT - MARGIN_BOTTOM, 0])


const g = svg.append('g')
  .attr('transform', `translate(${MARGIN_LEFT})`)

g.selectAll('rect')
  .data(DATA)
  .enter()
  .append('rect')
  .attr('x', (d, i) =>  i * BAR_WIDTH)
  .attr('width', BAR_WIDTH - MARGIN)
  .attr('y', d => yScale(d.productionPotentielle))
  .attr('height', d => HEIGHT - MARGIN_BOTTOM - yScale(d.productionPotentielle))
  .attr('fill', 'steelblue')

g.selectAll('text')
  .data(DATA)
  .enter()
  .append('text')
  .text(d => d.commune)
  .attr('x', (d, i) =>  i * BAR_WIDTH + BAR_WIDTH / 2)
  .attr('y', HEIGHT - MARGIN_BOTTOM / 2)
  .attr('text-anchor', 'left')
  .attr('font-size', `${BAR_WIDTH}`)
  .attr('transform', (d, i) => `rotate(90, ${i * BAR_WIDTH + MARGIN + MARGIN_LEFT - 21}, ${HEIGHT - MARGIN_BOTTOM + MARGIN + 35})`)
  // 21 et 35 : valeurs magiques pour aligner les textes ...


const axisY = axisLeft().scale(yScale)
  .tickFormat(d => `${d} GWh`)
  .ticks(5)

svg.append('g')
  .attr('transform', `translate(${MARGIN_LEFT})`)
  .call(axisY)