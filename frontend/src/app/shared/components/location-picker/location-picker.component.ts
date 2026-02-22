import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, viewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="location-picker-container">
      <div class="map-container" #mapContainer></div>
      <div class="location-info">
        @if (selectedLocation()) {
          <p class="coordinates">
            Latitude: {{ selectedLocation()?.lat?.toFixed(6) }}, 
            Longitude: {{ selectedLocation()?.lng?.toFixed(6) }}
          </p>
        } @else {
          <p class="instructions">Click on the map to select a location</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .location-picker-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .map-container {
      width: 100%;
      height: 400px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .location-info {
      padding: 0.75rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .coordinates {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
      font-family: monospace;
    }
    .instructions {
      margin: 0;
      font-size: 0.9rem;
      color: #999;
      font-style: italic;
    }
  `]
})
export class LocationPickerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() initialLatitude?: number;
  @Input() initialLongitude?: number;
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  mapContainer = viewChild<ElementRef>('mapContainer');
  selectedLocation = signal<{ lat: number; lng: number } | null>(null);
  private map: any;
  private marker: any;

  ngOnInit(): void {
    // Wait for Google Maps to load
  }

  ngAfterViewInit(): void {
    // Initialize map after view is ready
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.marker) {
      google.maps.event.clearInstanceListeners(this.marker);
    }
  }

  private initMap(): void {
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }

    const container = this.mapContainer()?.nativeElement;
    if (!container) {
      return;
    }

    const initialLat = this.initialLatitude ?? 0;
    const initialLng = this.initialLongitude ?? 0;
    const center = { lat: initialLat || 0, lng: initialLng || 0 };

    // Default to Kalmunai, Sri Lanka if no initial coordinates
    const defaultCenter = { lat: 7.4167, lng: 81.8167 }; // Kalmunai, Sri Lanka
    const mapCenter = (initialLat && initialLng) ? center : defaultCenter;

    this.map = new google.maps.Map(container, {
      center: mapCenter,
      zoom: (initialLat && initialLng) ? 15 : 10, // Better zoom for Sri Lanka default
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create marker if initial location provided
    if (initialLat && initialLng) {
      this.marker = new google.maps.Marker({
        position: center,
        map: this.map,
        draggable: true,
        title: 'Shop Location'
      });

      this.selectedLocation.set({ lat: initialLat, lng: initialLng });
      this.locationSelected.emit({ lat: initialLat, lng: initialLng });
    }

    // Add click listener to map
    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (this.marker) {
        this.marker.setPosition({ lat, lng });
      } else {
        this.marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          draggable: true,
          title: 'Shop Location'
        });

        // Add drag listener
        this.marker.addListener('dragend', (event: any) => {
          const draggedLat = event.latLng.lat();
          const draggedLng = event.latLng.lng();
          this.updateLocation(draggedLat, draggedLng);
        });
      }

      this.updateLocation(lat, lng);
    });

    // Add drag listener if marker exists
    if (this.marker) {
      this.marker.addListener('dragend', (event: any) => {
        const draggedLat = event.latLng.lat();
        const draggedLng = event.latLng.lng();
        this.updateLocation(draggedLat, draggedLng);
      });
    }
  }

  private updateLocation(lat: number, lng: number): void {
    this.selectedLocation.set({ lat, lng });
    this.locationSelected.emit({ lat, lng });
  }
}
