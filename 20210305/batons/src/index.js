import {
  axisLeft,
  select,
  scaleLinear,
  max,
} from 'd3'

/*
const data = require('./newData.json')

console.log(data)


const DATA = [
  { nom: 'Lausanne', population: 138905 },
  { nom: 'Yverdon-les-Bains', population: 30143 },
  { nom: 'Montreux', population: 26574 },
  { nom: 'Renens', population: 21036 },
  { nom: 'Nyon', population: 20533 },
  { nom: 'Vevey', population: 19827 },
]*/

var DATA = [
  {
      commune: "Aeugst am Albis",
      productionPotentielle: 13.43
  },
  {
      commune: "Affoltern am Albis",
      productionPotentielle: 50.06
  },
  {
      commune: "Bonstetten",
      productionPotentielle: 19.66
  },
  {
      commune: "Hausen am Albis",
      productionPotentielle: 23.67
  },
  {
      commune: "Hedingen",
      productionPotentielle: 19.14
  },
  {
      commune: "Kappel am Albis",
      productionPotentielle: 9.47
  },
  {
    commune: "Knonau",
    productionPotentielle: 13.18
},
{
    commune: "Maschwanden",
    productionPotentielle: 6.12
},
{
    commune: "Mettmenstetten",
    productionPotentielle: 30.41
},
].sort((a, b) => a.productionPotentielle > b.productionPotentielle ? -1 : 1) // tri décroissant

const WIDTH = 1000
const HEIGHT = 500
const MARGIN = 5
const MARGIN_LEFT = 50
const MARGIN_BOTTOM = 50
const BAR_WIDTH = (WIDTH - MARGIN_LEFT) / DATA.length

const svg = select('body')
  .append('svg')
  .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

const yScale = scaleLinear()
  .domain([0, max(DATA, d => d.productionPotentielle)])
  .range([HEIGHT - MARGIN_BOTTOM, 0])


const g = svg.append('g')
  .attr('transform', `translate(${MARGIN_LEFT}, 0)`)

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
  .attr('text-anchor', 'middle')

const axisY = axisLeft().scale(yScale)
  .tickFormat(d => `${d} GWh`)
  .ticks(5)

svg.append('g')
  .attr('transform', `translate(${MARGIN_LEFT - 3})`)
  .call(axisY)
