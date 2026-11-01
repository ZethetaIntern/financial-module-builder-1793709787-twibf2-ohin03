import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "@/lib/finance/compound-interest";

describe("calculateCompoundInterest", () => {
  it("calculates monthly compound interest correctly", () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 8,
      years: 5,
      frequency: 12,
    });

    expect(result.futureValue).toBeCloseTo(14898.46, 2);
    expect(result.interest).toBeCloseTo(4898.46, 2);
  });

  it("returns principal when interest rate is zero", () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 0,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 10000,
      interest: 0,
    });
  });

  it("handles zero principal", () => {
    const result = calculateCompoundInterest({
      principal: 0,
      rate: 8,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });

  it("rejects negative inputs", () => {
    const result = calculateCompoundInterest({
      principal: -100,
      rate: 8,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });

  it("rejects non-finite inputs", () => {
    const result = calculateCompoundInterest({
      principal: Infinity,
      rate: 8,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });

  it("rejects unsupported input limits", () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 1001,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });

  it("supports annual compounding", () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 10,
      years: 2,
      frequency: 1,
    });

    expect(result.futureValue).toBeCloseTo(12100, 2);
    expect(result.interest).toBeCloseTo(2100, 2);
  });

  it("rejects negative interest rates", () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: -5,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });

  it("rejects unsupported compounding frequency", () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 8,
      years: 5,
      frequency: 500,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });

  it("rejects excessively large principal values", () => {
    const result = calculateCompoundInterest({
      principal: 2_000_000_000_000,
      rate: 8,
      years: 5,
      frequency: 12,
    });

    expect(result).toEqual({
      futureValue: 0,
      interest: 0,
    });
  });
});
