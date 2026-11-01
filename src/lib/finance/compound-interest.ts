export interface CompoundInterestInput {
  principal: number;
  rate: number;
  years: number;
  frequency: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  interest: number;
}

export function calculateCompoundInterest({
  principal,
  rate,
  years,
  frequency,
}: CompoundInterestInput): CompoundInterestResult {
  const values = [principal, rate, years, frequency];

  if (!values.every(Number.isFinite)) {
    return { futureValue: 0, interest: 0 };
  }

  if (principal < 0 || rate < 0 || years < 0 || frequency < 1) {
    return { futureValue: 0, interest: 0 };
  }

  if (
    principal > 1_000_000_000_000 ||
    rate > 1000 ||
    years > 1000 ||
    frequency > 365
  ) {
    return { futureValue: 0, interest: 0 };
  }

  const futureValue =
    rate === 0
      ? principal
      : principal *
        Math.pow(
          1 + rate / 100 / frequency,
          frequency * years
        );

  if (!Number.isFinite(futureValue)) {
    return { futureValue: 0, interest: 0 };
  }

  return {
    futureValue,
    interest: futureValue - principal,
  };
}
