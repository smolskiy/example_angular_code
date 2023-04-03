import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '@shared/models';
import { UserService } from '@shared/services/user.service';

@Injectable()
export class ContactProfileResolver implements Resolve<IUser> {
  constructor(private readonly _userService: UserService) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<IUser> {
    const { contactId } = route.params;
    return this._userService.get(contactId);
  }
}
