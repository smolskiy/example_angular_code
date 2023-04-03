import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ModalsModule } from '@modals/modals.module';
import { FormsModule } from '@forms/forms.module';
import { OrganizationInfoPageComponent, OrganizationListPageComponent } from './pages';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationResolver } from './resolvers/organization.resolver';
import { ContactProfileResolver } from './resolvers/contact-profile-resolver.service';
import { ContactProfileComponent } from './components/contact-profile/contact-profile.component';
import { OrganizationStatsListComponent } from './components/organization-stats-list/organization-stats-list.component';
import { EditContactProfileComponent } from './components/edit-contact-profile/edit-contact-profile.component';
import { ReactivateOrganisationComponent } from './components/reactivate-organisation/reactivate-organisation.component';
import { OrganizationSharedModule } from '../../modules/organization-shared/organization-shared.module';
import { TableModule } from '../../modules/table/table.module';

@NgModule({
  declarations: [
    OrganizationListPageComponent,
    OrganizationInfoPageComponent,
    ReactivateOrganisationComponent,
    ContactProfileComponent,
    EditContactProfileComponent,
    OrganizationStatsListComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    OrganizationSharedModule,
    OrganizationRoutingModule,
    CommonModule,
    ModalsModule,
    FormsModule,
    TableModule,
  ],
  providers: [OrganizationResolver, ContactProfileResolver],
})
export class OrganizationModule {}
