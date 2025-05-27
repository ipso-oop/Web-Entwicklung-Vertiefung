import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker, MapInfoWindow } from '@angular/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('mainMarker') mainMarker!: MapMarker;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  // Kartenparameter
  title= 'Angular Google Maps Demo';
  zoom = 7;
  center: google.maps.LatLngLiteral = { lat: 47.050168, lng: 8.309307 }; // Luzern

  // Marker für Luzern mit InfoWindow
  markerPosition: google.maps.LatLngLiteral = this.center;
  infoContent = '📍 Du';

  // Weitere Marker
  markers = [
    { position: { lat: 47.050168, lng: 8.309307 }, label: 'Luzern' },
    { position: { lat: 47.376887, lng: 8.541694 }, label: 'Zürich' },
    { position: { lat: 46.94809, lng: 7.44744 }, label: 'Bern' },
  ];

  ngOnInit(): void {
    // Optional: aktuellen Standort setzen (nur HTTPS oder localhost!)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.markerPosition = this.center;
      },
      (error) => {
        console.warn('Geolocation nicht verfügbar oder abgelehnt.', error);
      }
    );
  }

  openInfoWindow() {
    this.infoWindow.open(this.mainMarker);
  }

  // Zoom-Funktionen
  zoomIn() {
    if (this.zoom < 21) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > 1) this.zoom--;
  }
}
