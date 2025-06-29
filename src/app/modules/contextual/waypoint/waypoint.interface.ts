export interface IWaypoint {
  name: string;
  description: string;
  icon: string;
  photos: string[];
  location: {
    type: string;
    coordinates: number[];
  };
  wether: {
    sunrise: string;
    cloud: string;
    humidity: string;
  };
}
