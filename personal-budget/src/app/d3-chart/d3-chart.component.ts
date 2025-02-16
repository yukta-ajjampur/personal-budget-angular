import { AfterViewInit, Component } from '@angular/core';
import * as d3 from 'd3';
import { BudgetDataService } from '../budget-data.service';

@Component({
  selector: 'pb-d3-chart',
  imports: [],
  templateUrl: './d3-chart.component.html',
  styleUrl: './d3-chart.component.scss',
  standalone: true
})

export class D3ChartComponent implements AfterViewInit {
  private data: any[] = [];
  private svg: any;
  private margin = 70;
  private width = 500; 
  private height = 500;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;
  private tooltip: any;

  constructor(private budgetDataService:BudgetDataService){ }

  private createSvg(): void {
    // Create SVG container for pie chart
    this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
  
    // Create tooltip
    this.tooltip = d3.select("figure#pie")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)")
      .style("visibility", "hidden")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("font-family", "Arial, sans-serif");
  }

  private createColors(): void {
    // Define a color scale for the chart slices
    this.colors = d3.scaleOrdinal()
      .domain(this.data.map(d => d.title))
      .range(["#8A2BE2", "#FFD700", "#33FFF5"]);
  }

  private drawChart(): void {
    // Define pie layout to compute slice angles
    const pie = d3.pie<any>().value((d: any) => Number(d.budget));
  
    // Define arc generator for slices
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);
  
    // Create slices of the pie chart
    const slices = this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => this.colors(d.data.title))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .on("mouseover", (event: MouseEvent, d: any) => {
        this.tooltip
          .html(`<strong>${d.data.title}</strong><br>Budget: $${d.data.budget}`)
          .style("visibility", "visible");
      })
      .on("mousemove", (event: MouseEvent) => {
        this.tooltip
          .style("top", `${event.pageY - 40}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        this.tooltip.style("visibility", "hidden");
      });
  
    // Add labels to each slice
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);
  
    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: any) => d.data.title)
      .attr("transform", (d: any) => `translate(${labelLocation.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")  // Adjusted font size for readability
      .style("fill", "#fff") // White text for better contrast
      .style("font-weight", "bold");  // Make the text bold for better readability
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.budgetDataService.getBudgetData().subscribe((res) => {
        this.data = res.myBudget;
        this.createSvg();
        this.createColors();
        this.drawChart();
      });
    }
  }

}