import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() rating: any;
  @Input() isReadOnly: boolean = false;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onStarClick(index: number) {
    if (!this.isReadOnly) {
      this.rating = index + 1;
      this.ratingChange.emit(this.rating);
    }
  }
}
