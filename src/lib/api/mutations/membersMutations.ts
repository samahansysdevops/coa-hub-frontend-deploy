import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../services/membersApi";
import {
  CreateMemberRequest,
  UpdateMemberRequest,
} from "@/lib/types/requests/member";
import { toast } from "sonner";

export function useCreateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberRequest) => membersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage = apiError.data?.message || error.message;
        toast.error(`Failed to create member: ${errorMessage}`);
        console.error("API Error:", error);
      } else {
        toast.error("Failed to create member");
      }
    },
  });
}

/** Create member with image upload */
export function useCreateMemberWithImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; position: string; email: string; categoryId: number; image?: File }) =>
      membersApi.createWithImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage = apiError.data?.message || error.message;
        toast.error(`Failed to create member: ${errorMessage}`);
        console.error("API Error:", error);
      } else {
        toast.error("Failed to create member");
      }
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberRequest }) =>
      membersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", variables.id] });
      toast.success("Member updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage = apiError.data?.message || error.message;
        toast.error(`Failed to update member: ${errorMessage}`);
      } else {
        toast.error("Failed to update member");
      }
    },
  });
}

/** Update member with image upload */
export function useUpdateMemberWithImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; position?: string; email?: string; categoryId?: number; image?: File } }) =>
      membersApi.updateWithImage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", variables.id] });
      toast.success("Member updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage = apiError.data?.message || error.message;
        toast.error(`Failed to update member: ${errorMessage}`);
      } else {
        toast.error("Failed to update member");
      }
    },
  });
}

export function useDeleteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member-designations"] });
      toast.success("Member deleted successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage = apiError.data?.message || error.message;
        toast.error(`Failed to delete member: ${errorMessage}`);
      } else {
        toast.error("Failed to delete member");
      }
    },
  });
}
