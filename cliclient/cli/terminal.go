package cli

import (
	"fmt"

	"golang.org/x/term"
)

func Writeln(t *term.Terminal, line string) (n int, err error) {
	return t.Write([]byte(line + "\n"))
}

func Writef(t *term.Terminal, line string, args ...any) (n int, err error) {
	builtLine := fmt.Sprintf(line, args...)
	return t.Write([]byte(builtLine))
}

func Write(t *term.Terminal, line string) (n int, err error) {
	return t.Write([]byte(line))
}
