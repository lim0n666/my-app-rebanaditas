import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { MealDbCategory, MealDbCategoriesResponse, MealDbMeal, MealDbSearchResponse } from '../models/mealdb.models';

/** Read-only recipe catalog adapter for the public educational TheMealDB key. */
@Injectable({ providedIn: 'root' })
export class MealDbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  searchMeals(term: string): Observable<MealDbMeal[]> {
    const params = new HttpParams().set('s', term.trim());
    return this.http.get<MealDbSearchResponse>(`${this.baseUrl}/search.php`, { params }).pipe(
      map(response => response.meals ?? []),
      catchError(this.toUserError)
    );
  }

  mealsByCategory(category: string): Observable<MealDbMeal[]> {
    const params = new HttpParams().set('c', category.trim());
    return this.http.get<MealDbSearchResponse>(`${this.baseUrl}/filter.php`, { params }).pipe(
      map(response => response.meals ?? []),
      catchError(this.toUserError)
    );
  }

  mealDetails(id: string): Observable<MealDbMeal | null> {
    const params = new HttpParams().set('i', id);
    return this.http.get<MealDbSearchResponse>(`${this.baseUrl}/lookup.php`, { params }).pipe(
      map(response => response.meals?.[0] ?? null),
      catchError(this.toUserError)
    );
  }

  categories(): Observable<MealDbCategory[]> {
    return this.http.get<MealDbCategoriesResponse>(`${this.baseUrl}/categories.php`).pipe(
      map(response => response.categories ?? []),
      catchError(this.toUserError)
    );
  }

  private readonly toUserError = (error: HttpErrorResponse) => {
    const message = error.status === 0
      ? 'No se pudo conectar con TheMealDB. Revisa tu conexión e inténtalo de nuevo.'
      : `TheMealDB respondió con un error (${error.status}). Inténtalo más tarde.`;
    return throwError(() => new Error(message));
  };
}
