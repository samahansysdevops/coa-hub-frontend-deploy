export interface CuartaPresentation {
  id: number;
  gdriveLink: string;
  lastModifiedAt: string;
  modifiedAt: string;
}

export interface UpdateCuartaPresentationDto {
  gdriveLink: string;
  lastModifiedAt: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink: string;
  thumbnailLink?: string;
  modifiedTime: string;
  size?: string;
}

export interface DriveFilesResponse {
  files: DriveFile[];
  configured: boolean;
}
