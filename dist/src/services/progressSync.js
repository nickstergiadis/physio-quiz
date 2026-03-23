function toMillis(value) {
  if (typeof value !== 'string') return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function chooseSourceSnapshot({ localSnapshot, remoteSnapshot }) {
  const local = isRecord(localSnapshot) ? localSnapshot : {};
  const remote = isRecord(remoteSnapshot) ? remoteSnapshot : {};

  const localUpdated = toMillis(local.updatedAt);
  const remoteUpdated = toMillis(remote.updatedAt);

  if (localUpdated > remoteUpdated + 5000) {
    return {
      winner: 'local',
      snapshot: local,
      reason: 'Local changes were newer than remote.'
    };
  }

  return {
    winner: 'remote',
    snapshot: remote,
    reason: remoteUpdated ? 'Remote profile restored.' : 'Remote profile restored (no timestamp).'
  };
}
