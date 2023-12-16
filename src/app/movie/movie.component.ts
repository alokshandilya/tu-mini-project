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
  localStorageKeyBase = 'movie_reviews';

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
      this.loadMovie();
    });
  }

  loadMovie() {
    const filteredMovies = this.movies.filter(
      (movie: { id: string }) => movie.id == this.id
    );
    if (filteredMovies.length > 0) {
      // Create a copy of the reviews array for each movie
      this.movie = { ...filteredMovies[0] };

      // Load existing reviews from local storage if any
      const localStorageKey = `${this.localStorageKeyBase}_${this.id}`;
      const storedReviews = localStorage.getItem(localStorageKey);
      this.movie.reviews = storedReviews ? JSON.parse(storedReviews) : [];
    }
  }

  submitReview() {
    // Create a copy of the movie object to avoid modifying the original array
    const updatedMovie = { ...this.movie };

    // Add the new review to the movie reviews array
    updatedMovie.reviews.push({
      author: this.newReview.author,
      published_on: new Date(),
      rating: this.newReview.rating,
      text: this.newReview.text,
    });

    // Save reviews to local storage with a unique key for each movie
    const localStorageKey = `${this.localStorageKeyBase}_${this.id}`;
    localStorage.setItem(localStorageKey, JSON.stringify(updatedMovie.reviews));

    // Reload the movie to reflect the changes
    this.loadMovie();

    // Clear the form
    this.newReview = {};
  }
}
