import { Artist } from '../entities/artist';
import { useApiConsumer, apiGetMutator, apiMutator } from './common';

export const useArtistPersonalInfoMutator =
  apiMutator<Artist.Schemas.PersonalInfo.DTO>('/artist/info');

export const useArtistPersonalInfoGetMutator = useApiConsumer<{ id: any }>(
  '/artist/{id}/info',
);

export const useArtistVerificationMutator =
  apiMutator<Artist.ID.DTO>('/artist/verify');

export const useArtistTransfer = apiMutator('/artist/transfer');

export const useArtistCapture = apiMutator<
  Artist.ID.DTO & Artist.Schemas.PersonalInfo.DTO
>('/artist/capture');

export const useGalleryCapture =
  apiMutator<Artist.Gallery.DTO>('/profile/gallery');

export const useGalleryGet = apiGetMutator<{ user_id: any }>(
  '/profile/gallery',
);

export const useProfileCapture = apiMutator<
  Artist.BasicInformation.DTO & Artist.Details.DTO
>('/profile/saveProfile');

export const useProfileGet = apiGetMutator<{ user_id: any }>(
  '/profile/saveProfile',
);

export const useAvailabilityMutator = apiMutator<Artist.Availability.DTO>(
  '/profile/availability',
);

export const useAvailabilityGet = apiGetMutator<{ user_id: any }>(
  '/profile/availability',
);

// Sample function, do not use it
export const useArtistProfileConsumer = useApiConsumer<
  { id: string },
  { name: string }
>('/artist/{id}/profile');
