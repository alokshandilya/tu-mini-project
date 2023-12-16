import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  type = '';
  id = '';
  url = '';
  movies: any;
  movie: any;
  newReview: any = {};
  localStorageKey = 'movie_reviews';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.params['type'];
    this.id = this.route.snapshot.params['id'];
    if (this.type === 'trending') {
      this.url = 'http://localhost:4200/assets/data/trending-movies.json';
    }
    if (this.type === 'theatre') {
      this.url = 'http://localhost:4200/assets/data/theatre-movies.json';
    }
    if (this.type === 'popular') {
      this.url = 'http://localhost:4200/assets/data/popular-movies.json';
    }
    this.getMovie();
  }

  getMovie() {
    this.http.get(this.url).subscribe((movies) => {
      this.movies = movies;
      let index = this.movies.findIndex(
        (movie: { id: string }) => movie.id == this.id
      );
      if (index > -1) {
        this.movie = this.movies[index];

        // Load existing reviews from local storage if any
        const storedReviews = localStorage.getItem(this.localStorageKey);
        this.movie.reviews = storedReviews ? JSON.parse(storedReviews) : [];
      }
    });
  }

  submitReview() {
    // Add the new review to the movie reviews array
    this.movie.reviews.push({
      author: this.newReview.author,
      published_on: new Date(),
      rating: this.newReview.rating,
      text: this.newReview.text
    });

    // Save reviews to local storage
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.movie.reviews));

    // Clear the form
    this.newReview = {};
  }
}
