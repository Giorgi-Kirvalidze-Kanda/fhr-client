import {Component, OnInit, signal} from '@angular/core';
import {FhirService} from '../fhir.service';
import {Practitioner} from '../practitioner.model';
import {EpicApiService} from '../epi-api.service';
import {fhirclient} from 'fhirclient/lib/types';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  idToken = signal<string | undefined>(undefined);
  isLoading = signal(false);
  currentPractitioner = signal<Practitioner | null>(null);

  constructor(private _fhirService: FhirService, private _epicService: EpicApiService) {
  }

  async ngOnInit() {
    // Check if we're returning from the authorization server
    if (window.location.search.includes('code') || window.location.search.includes('state')) {
      // Complete the OAuth2 process
      const client = await this._fhirService.initFhirClientAfterRedirect();
      this.idToken.set(client.state.tokenResponse?.id_token);
      this.isLoading.set(true)
      this.currentPractitioner.set(await this._fhirService.getCurrentPractitioner());
    } else {
      // Start the SMART launch process
      await this._fhirService.authorizeFhirClient();
    }
    this.isLoading.set(false)
  }

  async makeTestCallToEpicApi() {
    try {
      await firstValueFrom(this._epicService.makeTestCallToEpicApi(this.idToken()));
    } catch (error) {
      console.error('Error calling Epic API:', error);
    }
  }
}
