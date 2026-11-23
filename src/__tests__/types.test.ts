import { STAGE_LABELS, STATUS_LABELS, DEMO_USERS } from '../types';

describe('STAGE_LABELS', () => {
  it('has exactly 4 entries', () => {
    expect(Object.keys(STAGE_LABELS)).toHaveLength(4);
  });

  it('maps formwork_erected correctly', () => {
    expect(STAGE_LABELS.formwork_erected).toBe('Formwork Erected');
  });

  it('maps reinforcement_placed correctly', () => {
    expect(STAGE_LABELS.reinforcement_placed).toBe('Reinforcement Placed');
  });

  it('maps concrete_poured correctly', () => {
    expect(STAGE_LABELS.concrete_poured).toBe('Concrete Poured');
  });

  it('maps structure_complete correctly', () => {
    expect(STAGE_LABELS.structure_complete).toBe('Structure Complete');
  });
});

describe('STATUS_LABELS', () => {
  it('has exactly 5 entries', () => {
    expect(Object.keys(STATUS_LABELS)).toHaveLength(5);
  });

  it('contains all required statuses', () => {
    expect(STATUS_LABELS).toHaveProperty('pending');
    expect(STATUS_LABELS).toHaveProperty('verified');
    expect(STATUS_LABELS).toHaveProperty('approved');
    expect(STATUS_LABELS).toHaveProperty('flagged');
    expect(STATUS_LABELS).toHaveProperty('rejected');
  });

  it('labels pending as Pending Analysis', () => {
    expect(STATUS_LABELS['pending']).toBe('Pending Analysis');
  });

  it('labels approved correctly', () => {
    expect(STATUS_LABELS['approved']).toBe('Approved');
  });
});

describe('DEMO_USERS', () => {
  it('has exactly 2 demo users', () => {
    expect(DEMO_USERS).toHaveLength(2);
  });

  it('first demo user is a manager', () => {
    expect(DEMO_USERS[0].role).toBe('manager');
  });

  it('second demo user is an owner', () => {
    expect(DEMO_USERS[1].role).toBe('owner');
  });

  it('every demo user has an id, name and role', () => {
    for (const user of DEMO_USERS) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
    }
  });
});
