
# Brainfart, the worst programming language you will never use, based on *Brainfuck*.
:)
It's pretty much an expansion of *Brainfuck*
# Why?
The reason I made this was because it looked fun and I fell in love with the mind-bending nature of trying to write code in the *Brainfuck* eso-lang, and had tons of fun trying to write mini-programs and thinking algorithmically.

So I started writing a simple NodeJS "runtime" for it, to be honest it did not take that long to write one with it's simple 8 operation instruction set. But I wanted to extend it and I thought that the best thing to do would be to add "registers". These would be able to be accessed like variables throughout the entire memory space, and would allow for a much faster & easier writing. As well as making space easier to handle.
# What?
Its a cool programming language. :)
It's also very "fun" to write in. :(
# When?
In 2022-something.
# Where?
Somewhere in sunny California.
# How?
Magic.
# GIVE ME EXAMPLES!
Well, I recommend going to the /examples directory if you would like examples on the language and its instructions. But here is one example that, some would even say, over-commented code.

|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
$ This is a simple example of a program that multiplies two numbers in Brainfart :)

++++sa> $ Here, we are establishing our first 'variable' in a way, more like we are using an internal register 'a' to store the value of the first number.

+++++sb> $ And here, we are doing the same, but for the second number, and using the 'b' register.

Mab $ Now, we are going to multiply the two numbers, and store the result in the currents pointer value.

$ The main program is done now, but if we want to clean up the output, for example putting the result as the first index, and getting rid of the inputs, as well as clearing the registers we can do so.

sact<ct<ctpacacb $ Now this may look a bit confusing, but it is actually quite simple. Essentially, we are setting the a register to the currents pointers value which is the result of the multiplication, the reason for this is...

$ is that we want to save the result because we are deleting the current pointers value (more like setting it to 0), we are clearing it via the 'ct' command that stands for clear this. After that we are moving to the left...

$ that was where we stored the second number, and we are using the ct command to clear that again. We are moving to the left again, and again we are clearing the current pointers value...

$ the we are using the 'pa' command standing for put a, remember the 'a' register is the result of the multiplication after we overrode the numbers used in the operation...

$ then we now use the 'ca' command to clear the 'a' register's value because we don't need it anymore, then we do the same for the 'b' register, and we are done.

$ See? Very simple.
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
