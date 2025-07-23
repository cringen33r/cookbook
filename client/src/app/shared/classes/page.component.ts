import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cb-page',
  standalone: true,
  imports: [],
  template: ``,
  styles: [``],
  host: {
    class: 'page'
  },
})
// component implementing loading stage
export abstract class PageComponent implements OnInit {
  protected titleService = inject(Title);
  // Real loading state
  isLoading = signal(true);
  // Loading state after debounce
  hasLoaded = false;
  loadingDebounce = 500;
  debounceTimeoutId!: number;

  error: string | null = null;
  abstract pageName: string;

  constructor() {
    // Implementing a small debounce so that loading isn't instant.
    // There are better ways in higher versions, but eh this will do
    effect(() => {
      const isLoading = this.isLoading();
      if (isLoading === true) this.hasLoaded = !isLoading;
      else {
        clearTimeout(this.debounceTimeoutId);
        setTimeout(() => {
          this.hasLoaded = !isLoading;
        }, this.loadingDebounce);
      }
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`COOKBOOK - ${this.pageName}`);
  }
}
