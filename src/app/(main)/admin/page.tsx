'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import { Plus, Users, Megaphone, FolderPlus, CalendarClock, FileText, FolderOpen, Presentation } from 'lucide-react';
import CreateNewSubmissionBinModal from '@/components/features/submission_bin_page/create_new_submission_bin';
import CreateNewDeadlineModal from '@/components/features/deadlines_page/create_new_deadline';
import CreateNewTemplateModal from '@/components/features/templates_page/create_new_template';
import CreateMemberModal from '@/components/features/members/create-member-modal';
import CreateCategoryModal from '@/components/features/members/create-category-modal';
import CreateAnnouncementModal from '@/components/announcements/CreateAnnouncementModal';
import EditCuartaPresentationModal from '@/components/features/cuarta_presentations/edit-cuarta-presentation-modal';
import { useCreateSubmissionBinMutation } from '@/lib/api/mutations/submission-bins.mutation';
import { useCreateDeadlineMutation } from '@/lib/api/mutations/deadline.mutation';
import { useCreateTemplateMutation } from '@/lib/api/mutations/template.mutation';
import { useCreateMemberWithImageMutation } from '@/lib/api/mutations/membersMutations';
import { useCreateCategoryMutation } from '@/lib/api/mutations/categoriesMutations';
import { toastSuccess, toastError } from '@/components/shared/toast';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [showSubmissionBinModal, setShowSubmissionBinModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showCuartaPresentationModal, setShowCuartaPresentationModal] = useState(false);

  const createSubmissionBin = useCreateSubmissionBinMutation();
  const createDeadline = useCreateDeadlineMutation();
  const createTemplate = useCreateTemplateMutation();
  const createMember = useCreateMemberWithImageMutation();
  const createCategory = useCreateCategoryMutation();

  const handleAddSubmissionBin = async (data: { name: string; fileFormat: string; fileName: string }) => {
    try {
      await createSubmissionBin.mutateAsync({
        name: data.name,
        fileFormat: data.fileFormat,
        fileName: data.fileName,
      });
      toastSuccess({
        title: 'Submission bin created',
        description: 'Your new submission bin has been saved.',
      });
      setShowSubmissionBinModal(false);
    } catch (err) {
      console.error('Failed to create submission bin:', err);
      toastError({
        title: 'Failed to create submission bin',
        description: 'Please try again.',
      });
    }
  };

  const handleAddDeadline = async (data: { name: string; dueDate: Date }) => {
    try {
      await createDeadline.mutateAsync({
        name: data.name,
        dueDate: data.dueDate.toISOString(),
      });
      toastSuccess({
        title: 'Deadline created',
        description: 'Your new deadline has been saved.',
      });
      setShowDeadlineModal(false);
    } catch (err) {
      console.error('Failed to create deadline:', err);
      toastError({
        title: 'Failed to create deadline',
        description: 'Please try again.',
      });
    }
  };

  const handleAddTemplate = async (data: { name: string; gdriveLink: string }) => {
    try {
      await createTemplate.mutateAsync({
        name: data.name,
        gdriveLink: data.gdriveLink,
      });
      toastSuccess({
        title: 'Template created',
        description: 'Your new template has been saved.',
      });
      setShowTemplateModal(false);
    } catch (err) {
      console.error('Failed to create template:', err);
      toastError({
        title: 'Failed to create template',
        description: 'Please try again.',
      });
    }
  };

  const handleAddMember = async (data: { name: string; position: string; email: string; categoryId: number; image?: File }) => {
    try {
      await createMember.mutateAsync({
        name: data.name,
        position: data.position,
        email: data.email,
        categoryId: data.categoryId,
        image: data.image,
      });
      setShowMemberModal(false);
    } catch (err) {
      console.error('Failed to create member:', err);
    }
  };

  const handleAddCategory = async (data: { name: string }) => {
    try {
      await createCategory.mutateAsync({
        name: data.name,
      });
      setShowCategoryModal(false);
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const quickActions: {
    title: string;
    description: string;
    onClick?: () => void;
    href?: string;
    icon: any;
    color: string;
  }[] = [
    {
      title: 'Add Member',
      description: 'Add a new team member',
      onClick: () => setShowMemberModal(true),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Add Category',
      description: 'Create a new member category',
      onClick: () => setShowCategoryModal(true),
      icon: FolderOpen,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Add Submission Bin',
      description: 'Create a new submission folder',
      onClick: () => setShowSubmissionBinModal(true),
      icon: FolderPlus,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Add Announcement',
      description: 'Post a new announcement',
      onClick: () => setShowAnnouncementModal(true),
      icon: Megaphone,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Add Deadline',
      description: 'Create a new deadline',
      onClick: () => setShowDeadlineModal(true),
      icon: CalendarClock,
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Add Template',
      description: 'Create a new template',
      onClick: () => setShowTemplateModal(true),
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Edit Cuarta Link',
      description: 'Update the presentations link',
      onClick: () => setShowCuartaPresentationModal(true),
      icon: Presentation,
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  const manageLinks = [
    {
      title: 'Manage Members',
      description: 'View, edit, and delete members',
      href: '/members',
      icon: Users,
    },
    {
      title: 'Manage Announcements',
      description: 'View, edit, and delete announcements',
      href: '/announcements',
      icon: Megaphone,
    },
  ];

  return (
    <>
      <div
        className="min-h-screen w-full py-8 px-6"
        style={{
          background: 'linear-gradient(18deg, #32383e 0%, #485159 45%, #6b7680 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1
              className="text-4xl md:text-6xl font-bebas-neue uppercase tracking-wide text-white mb-2"
            >
              Admin Dashboard
            </h1>
            <p className="text-gray-300 font-montserrat">
              Welcome, {user?.name || user?.adminRole || 'Admin'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-2xl font-bebas-neue uppercase tracking-wide text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const content = (
                  <div
                    className={`bg-gradient-to-br ${action.color} rounded-xl p-6 shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <Icon className="w-8 h-8 text-white mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-1 font-montserrat">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white/80 font-montserrat">
                      {action.description}
                    </p>
                  </div>
                );

                if (action.href) {
                  return (
                    <Link key={action.title} href={action.href}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={action.title} onClick={action.onClick}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manage Section */}
          <div>
            <h2 className="text-2xl font-bebas-neue uppercase tracking-wide text-white mb-4">
              Manage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {manageLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.title} href={link.href}>
                    <div className="bg-gradient-to-r from-[#373C44] to-[#49515A] rounded-xl p-6 shadow-lg hover:brightness-110 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white font-montserrat">
                            {link.title}
                          </h3>
                          <p className="text-sm text-gray-300 font-montserrat">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Bin Modal */}
      <CreateNewSubmissionBinModal
        open={showSubmissionBinModal}
        onClose={() => setShowSubmissionBinModal(false)}
        onSave={handleAddSubmissionBin}
      />

      {/* Deadline Modal */}
      <CreateNewDeadlineModal
        open={showDeadlineModal}
        onClose={() => setShowDeadlineModal(false)}
        onSave={handleAddDeadline}
      />

      {/* Template Modal */}
      <CreateNewTemplateModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSave={handleAddTemplate}
      />

      {/* Member Modal */}
      <CreateMemberModal
        open={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSave={handleAddMember}
      />

      {/* Category Modal */}
      <CreateCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleAddCategory}
      />

      {/* Announcement Modal */}
      <CreateAnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
      />

      {/* Cuarta Presentation Modal */}
      <EditCuartaPresentationModal
        open={showCuartaPresentationModal}
        onClose={() => setShowCuartaPresentationModal(false)}
      />
    </>
  );
}
