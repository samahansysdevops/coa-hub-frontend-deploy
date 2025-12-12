import { api } from "./apiClient";
import { CuartaPresentation, UpdateCuartaPresentationDto, DriveFilesResponse } from "@/lib/types/entities/cuarta-presentation";

export const cuartaPresentationService = {
  get: () => api.get<CuartaPresentation | null>('/cuarta-presentation'),

  getFiles: () => api.get<DriveFilesResponse>('/cuarta-presentation/files'),

  update: (dto: UpdateCuartaPresentationDto) =>
    api.put<CuartaPresentation>('/cuarta-presentation', dto),
};
