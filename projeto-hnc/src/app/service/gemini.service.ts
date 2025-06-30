import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${environment.geminiApiKey}`;

  constructor(private http: HttpClient) { }

  sendMessage(prompt: string, history: GeminiContent[] = []): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      contents: [
        ...history,
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
         maxOutputTokens: 200,
         temperature: 0.7,
         topP: 0.95,
         topK: 40
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };

    return this.http.post(this.apiUrl, payload, { headers: headers });
  }
}