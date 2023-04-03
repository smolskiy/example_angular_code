import { NgModule } from '@angular/core';
import { Data, RouterModule, Routes } from '@angular/router';
import { PageNames } from '@constants';
import { OrganizationListPageComponent, OrganizationInfoPageComponent } from './pages';
import { OrganizationResolver } from './resolvers/organization.resolver';
import { RouteData } from './models';
import { ContactProfileResolver } from './resolvers/contact-profile-resolver.service';
import { ContactProfileComponent } from './components/contact-profile/contact-profile.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: PageNames.Organizations,
    },
    children: [
      {
        path: '',
        component: OrganizationListPageComponent,
        data: {
          breadcrumb: null,
        },
      },
      {
        path: ':organizationId',
        data: {
          breadcrumb: (data: Data) => data[RouteData.Organization].name,
        },
        resolve: {
          organization: OrganizationResolver,
        },
        children: [
          {
            path: '',
            component: OrganizationInfoPageComponent,
            data: {
              breadcrumb: null,
            },
          },
          {
            path: 'contact/:contactId',
            component: ContactProfileComponent,
            data: {
              breadcrumb: 'Contact',
            },
            resolve: {
              adminProfile: ContactProfileResolver,
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
