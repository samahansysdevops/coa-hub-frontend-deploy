import { useQuery } from "@tanstack/react-query";
import { cuartaPresentationService } from "../services/cuarta-presentation.services";

export function useCuartaPresentationQuery() {
  return useQuery({
    queryKey: ["cuarta-presentation"],
    queryFn: cuartaPresentationService.get,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
