import type { EchoBit, GuidingEchoAttributes } from '../types'; 

// Renamed resolveEidolonIdentifier to getGuidingEchoTitleById
export const getGuidingEchoTitleById = (bitId: string, echoBits: EchoBit<GuidingEchoAttributes>[]): string => {
  const echoBit = echoBits.find(eBit => eBit.echo_bit_id === bitId);
  return echoBit ? echoBit.attributes.title : "Unknown Guiding Echo";
};