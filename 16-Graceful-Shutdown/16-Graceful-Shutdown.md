# Graceful Shutdown

- When a critical transaction, such as a product payment or a ticket booking, is in progress and the server restarts abruptly (planned or unplanned), the transaction's data can be lost. Handling the in-flight transactions before shutting down is called graceful shutdown.

- Good practices during a graceful shutdown:
  1. Let current transactions finish, within a time limit.
  2. Drain connections: stop accepting new requests.
  3. Reply to new requests with "try again later", or queue them in a wait pool.
  4. Save the full state by committing, or roll back the entire transaction or database operations.
  5. Notify clients, such as frontend apps, to stop sending requests or switch to the new server.
  6. Run cleanup tasks, such as flushing logs and deleting temporary files (this is mostly done in the reverse order of access).
  7. Release resources, such as closing database connections, file handles, and network sockets.

## Concepts

### Process Lifecycle Management

- Every backend runs as a process on a machine or server, and the process lifecycle decides how a process starts, lives, and gets destroyed.

- The operating system manages all the processes running on the machine. It sends different signals to processes to manage their lifecycle using inter-process communication. Every application process has a handler listening for these signals in the form of keywords.

- Every signal keyword is a combination of `SIG` + a process short name, like `SIGTERM` and `SIGKILL`.

- Example
  - Termination signals: used to stop the application.
    1. `SIGHUP`: Terminal closed or hangup; often used to reload configuration.
    2. `SIGINT`: Interrupt from the keyboard (`Ctrl+C`).
    3. `SIGQUIT`: Quit from the keyboard (`Ctrl+\`) and produces a core dump.
    4. `SIGKILL`: Immediately kills the process; cannot be caught or ignored.
    5. `SIGTERM`: Polite request to terminate; can be caught for graceful shutdown.

  - Fault (error) signals: used to indicate an error condition in the process.
    1. `SIGILL`: Illegal instruction was executed.
    2. `SIGABRT`: Process aborted itself, e.g. via `abort()`.
    3. `SIGFPE`: Invalid arithmetic operation, such as division by zero.
    4. `SIGSEGV`: Invalid memory access (segmentation fault).

  - Job control signals: used to pause, resume, or track the state of processes.
    1. `SIGCHLD`: A child process stopped or exited.
    2. `SIGSTOP`: Pauses the process; cannot be caught or ignored.
    3. `SIGTSTP`: Stop from the keyboard (`Ctrl+Z`); can be caught.
    4. `SIGCONT`: Resumes a stopped process.

  - Timer and I/O signals: used to notify the process of a timer expiry or an I/O problem.
    1. `SIGALRM`: Timer set by `alarm()` expired.
    2. `SIGPIPE`: Write to a pipe or socket with no reader.

  - User-defined signals: signals with application-specific meaning, like `SIGUSR1` / `SIGUSR2`.

## Implementation of Graceful Shutdown

1. Create handlers that listen to signals, events, and interrupts from the OS, such as `SIGTERM` and `SIGINT`.
2. Create the shutdown process:
   1. Stop the HTTP server from accepting new requests.
   2. Wait for in-flight requests and transactions to finish, within a time limit.
   3. Stop background jobs and queue consumers.
   4. Clear or flush the cache.
   5. Close the database connections and pool.
   6. Close external services, such as message queues and third-party clients.
   7. Flush logs and delete temporary files.
   8. Exit the process with the proper exit code.
3. Set a force-exit timer so the process still exits if the shutdown hangs.
