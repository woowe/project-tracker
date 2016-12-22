/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserInfoService } from './user-info.service';

describe('UserInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserInfoService]
    });
  });

  it('should ...', inject([UserInfoService], (service: UserInfoService) => {
    expect(service).toBeTruthy();
  }));
});
