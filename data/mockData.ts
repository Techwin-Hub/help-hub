export interface Report {
  id: string;
  title: string;
  status: 'pending' | 'inProgress' | 'resolved';
  date: string;
  location: string;
  description: string;
  reporter: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  city: string;
  rating: number;
  completedTasks: number;
  status: 'active' | 'inactive';
}

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Broken streetlight on Main Street',
    status: 'pending',
    date: '2024-01-15',
    location: 'Main Street, Downtown',
    description: 'The streetlight near the bus stop has been out for several days, creating safety concerns for pedestrians.',
    reporter: 'Anonymous',
    priority: 'medium',
  },
  {
    id: '2',
    title: 'Large pothole on Highway 101',
    status: 'inProgress',
    date: '2024-01-14',
    location: 'Highway 101, Mile Marker 15',
    description: 'Deep pothole causing damage to vehicles and creating traffic hazards.',
    reporter: 'John Doe',
    priority: 'high',
    assignedTo: 'Alex Johnson',
  },
  {
    id: '3',
    title: 'Garbage collection missed',
    status: 'resolved',
    date: '2024-01-13',
    location: 'Residential Area, Block A',
    description: 'Garbage has not been collected for three consecutive days in our neighborhood.',
    reporter: 'Jane Smith',
    priority: 'low',
    assignedTo: 'Maria Garcia',
  },
  {
    id: '4',
    title: 'Water leak in public park',
    status: 'pending',
    date: '2024-01-12',
    location: 'Central Park, East Side',
    description: 'Water pipe burst near the playground area, causing flooding.',
    reporter: 'Mike Wilson',
    priority: 'high',
  },
  {
    id: '5',
    title: 'Graffiti on public building',
    status: 'inProgress',
    date: '2024-01-11',
    location: 'City Hall, North Wall',
    description: 'Vandalism on the exterior wall of the city hall building.',
    reporter: 'Anonymous',
    priority: 'low',
    assignedTo: 'David Chen',
  },
];

export const mockVolunteers: Volunteer[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    phone: '+1-555-0101',
    city: 'Downtown',
    rating: 4.8,
    completedTasks: 23,
    status: 'active',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    phone: '+1-555-0102',
    city: 'Westside',
    rating: 4.9,
    completedTasks: 31,
    status: 'active',
  },
  {
    id: '3',
    name: 'David Chen',
    phone: '+1-555-0103',
    city: 'Eastside',
    rating: 4.7,
    completedTasks: 18,
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    phone: '+1-555-0104',
    city: 'Northside',
    rating: 4.6,
    completedTasks: 15,
    status: 'inactive',
  },
];

export const mockActivities = [
  {
    id: '1',
    action: 'Completed report',
    reportTitle: 'Broken streetlight repair',
    date: '2024-01-15',
    time: '14:30',
  },
  {
    id: '2',
    action: 'Submitted update',
    reportTitle: 'Pothole on Highway 101',
    date: '2024-01-14',
    time: '09:15',
  },
  {
    id: '3',
    action: 'Accepted assignment',
    reportTitle: 'Water leak in public park',
    date: '2024-01-13',
    time: '16:45',
  },
];