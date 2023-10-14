import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { ESelectDataMode } from '../samples-select-search/samples-select-search.page';

@Injectable({
  providedIn: 'root',
})
export class SelectSearchService {
  constructor(
    private httpClient: HttpClient,
    @Optional() @Inject('APP_ENV') private _appEnv?: string,
  ) { }

  queryLists(countMode: ESelectDataMode) {
    console.log(countMode);
    let suffix = '';
    switch (countMode) {
      case ESelectDataMode.short:
        suffix = '_100';
        break;
      case ESelectDataMode.middle:
        suffix = '_1k';
        break;
      case ESelectDataMode.large:
        suffix = '_10k';
        break;

      default:
        suffix = '_100';
        break;
    }
    if (this._appEnv === 'dev') {
      return this.httpClient.get<[]>(
        `/assets/mocks/data/lists/large_lists${suffix}.json`,
      );
    }
    return this.httpClient.get<[]>(
      `/assets/mocks/data/lists/large_lists.json${suffix}`,
    );
  }

}
