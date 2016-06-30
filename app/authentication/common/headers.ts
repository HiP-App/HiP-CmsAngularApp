import { Headers } from '@angular/http';

export const contentHeaders = new Headers();
contentHeaders.append('Accept', '*/*');
contentHeaders.append('Access-Control-Allow-Origin', 'http://localhost:5000');
contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
