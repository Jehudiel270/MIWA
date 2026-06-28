import { prisma } from "./prisma";

/**
 * Get user with all related data
 */
export async function getUserWithRelations(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      favorites: { include: { establishment: true } },
      bookings: { include: { room: true, establishment: true } },
      payments: true,
      reviews: true,
    },
  });
}

/**
 * Get establishment with all related data
 */
export async function getEstablishmentWithRelations(establishmentId: string) {
  return prisma.establishment.findUnique({
    where: { id: establishmentId },
    include: {
      rooms: true,
      bookings: true,
      reviews: true,
      favorites: true,
      flags: true,
    },
  });
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
  const [users, establishments, bookings, payments, feedback, messages] =
    await Promise.all([
      prisma.user.count(),
      prisma.establishment.count(),
      prisma.booking.count(),
      prisma.payment.count(),
      prisma.feedbackSubmission.count(),
      prisma.contactMessage.count(),
    ]);

  return {
    users,
    establishments,
    bookings,
    payments,
    feedback,
    messages,
  };
}

/**
 * Ban a user
 */
export async function banUser(userId: string, reason: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      is_banned: true,
      ban_reason: reason,
    },
  });
}

/**
 * Unban a user
 */
export async function unbanUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      is_banned: false,
      ban_reason: null,
    },
  });
}

/**
 * Verify an establishment
 */
export async function verifyEstablishment(establishmentId: string) {
  return prisma.establishment.update({
    where: { id: establishmentId },
    data: {
      verification_status: "VERIFIED",
      verification_date: new Date(),
    },
  });
}

/**
 * Create admin log entry
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>,
) {
  return prisma.adminLog.create({
    data: {
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details ?? undefined,
    },
  });
}
