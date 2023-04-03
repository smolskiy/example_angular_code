import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactProfileResolver } from './contact-profile-resolver.service';

describe('ContactProfileResolver', () => {
  let service: ContactProfileResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactProfileResolver],
    });
    service = TestBed.inject(ContactProfileResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
