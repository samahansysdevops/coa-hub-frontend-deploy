import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cuartaPresentationService } from "../services/cuarta-presentation.services";
import { UpdateCuartaPresentationDto } from "@/lib/types/entities/cuarta-presentation";

export function useUpdateCuartaPresentationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateCuartaPresentationDto) =>
      cuartaPresentationService.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuarta-presentation"] });
    },
  });
}
