import React from 'react';
import type { EchoBit, GuidingEchoAttributes } from '../types'; 

interface GuidingEchoGlyphProps {
  echoBit: EchoBit<GuidingEchoAttributes>; 
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (echoBitId: string) => void;
  className?: string; 
}

export const GuidingEchoGlyph: React.FC<GuidingEchoGlyphProps> = ({ echoBit, onSelect, isSelected, isDisabled, className }) => {
  const { attributes, category, echo_bit_id } = echoBit; 

  const handleSelectMotif = () => {
    if (!isDisabled) {
        onSelect(echo_bit_id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectMotif();
    }
  };

  // Base class name from EvolvGlobalStyles, specific component class
  const baseClassName = "echo-glyph"; // Updated class name to reflect EchoBit
  const dynamicClassName = `${baseClassName} ${className || ''} ${isSelected ? 'selected' : ''} ${isDisabled && !isSelected ? 'disabled' : ''}`.trim();

  return (
    <div
      className={dynamicClassName}
      onClick={handleSelectMotif}
      onKeyDown={handleKeyDown}
      tabIndex={isDisabled && !isSelected ? -1 : 0}
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={isDisabled && !isSelected}
      aria-label={`Select Guiding Echo: ${attributes.title}. Category: ${category}. Primary Focus: ${attributes.coreFocus}. Principle: ${attributes.description}`}
    >
      <h4>{attributes.title}</h4>
      <p><strong>Category:</strong> {category}</p>
      <p><strong>Focus:</strong> {attributes.coreFocus}</p>
      {/* Assuming influenceSpectrum and coreHeuristics might not be directly in GuidingEchoAttributes, or need mapping if they are */}
      {/* <p><strong>Spectrum:</strong> {attributes.influenceSpectrum}</p> */}
      {/* <p><strong>Heuristics:</strong> {attributes.coreHeuristics.substring(0,100)}{attributes.coreHeuristics.length > 100 ? "..." : ""}</p> */}
      <p><strong>Principle:</strong> {attributes.description.substring(0,100)}{attributes.description.length > 100 ? "..." : ""}</p>
    </div>
  );
};