export interface Course {
  _id?: string;
  title: string;
  code: string;
  description: string;
  instructor?: string;
  category?: string;
  price?: number;
  duration?: number | string;
  capacity?: number;
  enrolled?: number;
}