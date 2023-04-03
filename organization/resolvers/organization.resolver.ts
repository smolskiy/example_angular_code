import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationService } from '../../../modules/organization-shared/services/organization.service';
import { IDetailedOrganization } from '../../../modules/organization-shared/models/organization.model';

@Injectable()
export class OrganizationResolver implements Resolve<IDetailedOrganization> {
  constructor(private readonly _organizationService: OrganizationService) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<IDetailedOrganization> {
    const { organizationId } = route.params;
    return this._organizationService.getById(organizationId);
  }
}
