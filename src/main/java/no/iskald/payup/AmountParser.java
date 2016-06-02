package no.iskald.payup;

public class AmountParser {
    public static int fromDouble(double amount) {
        double amountInCents = amount * 100;
        return (int)Math.floor(amountInCents + 0.5d);
    }
}
