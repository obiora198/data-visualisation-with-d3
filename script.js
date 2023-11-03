const width = 800;
const height = 500;
const padding = 40;
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const toolTip = d3.select('body')
.append('div')
.attr('id','tooltip')
.style('visibility','hidden')


const svg = d3.select('body')
              .append('svg')
              .attr('width',width)
              .attr('height',height)
              .attr('padding',padding)

svg.append('text')
    .text('United States GDP')
    .attr('id','title')
    .attr('x',260)
    .attr('y', 40)

svg.append('text')
    .text('Gross Domestic Product')
    .attr('transform','rotate(-90)')
    .attr('x',-220 )
    .attr('y', 60)


fetch(url)
  .then(response => response.json())
  .then(data => {
  let dataset = data['data'];
  let xScale = d3.scaleLinear()
               .domain([0, dataset.length - 1])
               .range([padding, width - padding])
  let datesArray = dataset.map(data=> {
    return new Date(data[0])
  }) 
  // console.log(dataset)
  let xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray),d3.max(datesArray)])
                    .range([padding,width - padding])
  
  let yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset,d=>d[1])])
                   .range([height - padding, padding])
 
  let heightScale = d3.scaleLinear([])
               .domain([0, d3.max(dataset, (d)=> d[1])])
               .range([0, height - (2 * padding)]);
  
  let xAxis = d3.axisBottom(xAxisScale)
  
  svg.append("g")
      .call(xAxis)
      .attr('id','x-axis')
      .attr('transform',`translate(0,${height - padding})`)
  
  svg.append("g")
      .call(d3.axisLeft(yAxisScale))
      .attr('id','y-axis')
      .attr('transform',`translate(${padding},0)`)

  svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class','bar')
      .attr('width',(width - (padding * 2)) / dataset.length)
      .attr('data-date',d => d[0])
      .attr('data-gdp',d => d[1])
      .attr('height', (d)=> heightScale(d[1]))
      .attr('x', (d, i)=> xScale(i))
      .attr('y', d => height - padding - heightScale(d[1]))
      .attr('fill','#33adff') 
      .on('mouseover', (e,d) => {
        toolTip.style('position','absolute')
        .style('top','400px')
        .style('left',`${e.x + 20}px`)
        .attr('data-date',d[0])
        .transition().style('visibility','visible')
        document.getElementById('tooltip').innerHTML = `${d[0]} <br> ${d[1]}`
      })
      .on('mouseout', d => {
        toolTip.transition()
        .style('visibility','hidden')
      })
  })

