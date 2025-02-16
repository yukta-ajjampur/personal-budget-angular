import { Component, AfterViewInit } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { D3ChartComponent } from '../d3-chart/d3-chart.component';


interface BudgetResponse {
  myBudget: { title: string; budget: number }[];
}

@Component({
  selector: 'pb-homepage',
  imports: [ArticleComponent, CommonModule, BreadcrumbsComponent, D3ChartComponent],
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})

export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
        {
            data: [] as number[],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: [] as string[]
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.http.get<BudgetResponse>('http://localhost:3000/budget').subscribe((res) => {
        console.log(res);
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data.push(res.myBudget[i].budget);
          this.dataSource.labels.push(res.myBudget[i].title);
        }
        this.createChart();
      });
    }
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
      });
    }
  }
}