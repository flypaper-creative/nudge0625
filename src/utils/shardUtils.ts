
// Modular Shard System Interface (Codename: QuantumLattice) v1.0.0
// File: src/utils/shardUtils.ts

import type { Shard, RootShardComplex, ShardDataType, VersionEntry, VerificationDetails } from '../types';
import { formatISO } from 'date-fns';

export const findShardByPath = (rootShards: RootShardComplex[], path: string): Shard | null => {
  if (!path) return null;
  const ids = path.split('/');
  let currentShardsList: ReadonlyArray<Shard> = rootShards; // Use ReadonlyArray for safety with find
  let foundShard: Shard | null = null;

  for (let i = 0; i < ids.length; i++) {
    const currentId = ids[i];
    const currentFound = currentShardsList.find(s => s.shardId === currentId);
    if (!currentFound) return null;
    foundShard = currentFound;
    if (i < ids.length - 1) {
      currentShardsList = foundShard.nestedShards || [];
    }
  }
  return foundShard;
};

export const updateShardByPath = (
  rootShards: RootShardComplex[],
  path: string,
  updater: (shard: Shard) => Shard
): RootShardComplex[] => {
  const ids = path.split('/');
  
  const recursiveUpdate = (shards: Shard[], currentPathIndex: number): Shard[] => {
    if (currentPathIndex >= ids.length) return shards;

    const targetId = ids[currentPathIndex];
    return shards.map(shard => {
      if (shard.shardId === targetId) {
        if (currentPathIndex === ids.length - 1) {
          return updater(shard);
        } else {
          return {
            ...shard,
            nestedShards: recursiveUpdate(shard.nestedShards || [], currentPathIndex + 1),
            updatedAt: formatISO(new Date()) 
          };
        }
      }
      return shard;
    });
  };
  return recursiveUpdate(rootShards, 0);
};

export const addNestedShardByPath = (
  rootShards: RootShardComplex[],
  parentPath: string,
  newNestedShard: Shard
): RootShardComplex[] => {
  return updateShardByPath(rootShards, parentPath, (parentShard) => ({
    ...parentShard,
    nestedShards: [...(parentShard.nestedShards || []), newNestedShard],
    updatedAt: formatISO(new Date())
  }));
};

export const deleteShardByPath = (
    rootShards: RootShardComplex[],
    path: string
): RootShardComplex[] => {
    const ids = path.split('/');
    if (ids.length === 0) return rootShards;

    if (ids.length === 1) {
        return rootShards.filter(shard => shard.shardId !== ids[0]);
    }

    const parentPath = ids.slice(0, -1).join('/');
    const shardToDeleteId = ids[ids.length - 1];

    return updateShardByPath(rootShards, parentPath, (parentShard) => ({
        ...parentShard,
        nestedShards: (parentShard.nestedShards || []).filter(ns => ns.shardId !== shardToDeleteId),
        updatedAt: formatISO(new Date())
    }));
};

export const createVersion = (
    previousVersionEntry: VersionEntry | null,
    newData: ShardDataType,
    author: string,
    changesSummary: string,
    newVerificationDetails?: Partial<VerificationDetails>
): VersionEntry => {
    const now = formatISO(new Date());
    let newVersionId = "v1.0.0";

    if (previousVersionEntry) {
        const versionMatch = previousVersionEntry.versionId.match(/^v(\d+)\.(\d+)\.(\d+)$/);
        if (versionMatch) {
            let major = parseInt(versionMatch[1], 10);
            let minor = parseInt(versionMatch[2], 10);
            let patch = parseInt(versionMatch[3], 10);
            patch++; // Simple patch increment
            newVersionId = `v${major}.${minor}.${patch}`;
        } else { // Fallback for non-standard or initial versions like "v1.0" or "v1"
            const lastNum = parseFloat(previousVersionEntry.versionId.replace(/[^\d.]/g, '')) || 1.0;
             // Ensure at least two decimal places for patch-like increments
            const incrementedNum = lastNum + 0.01;
            if (Number.isInteger(lastNum)) { // If prev was v1, next is v1.01
                 newVersionId = `v${incrementedNum.toFixed(2)}`;
            } else { // If prev was v1.x, next is v1.x+0.01
                 newVersionId = `v${incrementedNum.toFixed(previousVersionEntry.versionId.split('.')[1]?.length || 2)}`;
            }
        }
    }

    // Ensure data snapshot is a deep copy
    const dataSnapshotCopy = typeof newData === 'object' && newData !== null 
        ? JSON.parse(JSON.stringify(newData))
        : newData;

    return {
        versionId: newVersionId,
        timestamp: now,
        author: author,
        changesSummary: changesSummary,
        dataSnapshot: dataSnapshotCopy,
        verificationDetails: {
            status: newVerificationDetails?.status || 'unverified',
            method: newVerificationDetails?.method || 'not_applicable',
            sources: newVerificationDetails?.sources || [],
            notes: newVerificationDetails?.notes || "Data changed, re-verification recommended.",
            verifiedBy: author, // Could be system, user, AI
            verificationTimestamp: now,
            requiredSourcesMet: newVerificationDetails?.requiredSourcesMet || false,
        }
    };
};
