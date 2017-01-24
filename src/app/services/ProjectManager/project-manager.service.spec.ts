/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectManagerService } from './project-manager.service';

describe('ProjectManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectManagerService]
    });
  });

  it('should ...', inject([ProjectManagerService], (service: ProjectManagerService) => {
    expect(service).toBeTruthy();
  }));
});
