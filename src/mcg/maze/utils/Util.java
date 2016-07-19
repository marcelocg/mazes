package mcg.maze.utils;

public class Util {

	public static final char getAscii(int code) {
		if (code >= 0x80 && code <= 0xFF) {
			return Constants.EXTENDED[code - 0x7F];
		}
		return (char) code;
	}

	public static final void printChar(int code) {
		System.out.printf("%c%n", getAscii(code));
	}

}
