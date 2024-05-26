const fileSystem = {
    '/': {
        'bin': {
            'ls': 'command',
            'grep': 'command',
            'cat': 'command',
            'echo': 'command',
            'cd': 'command',
        },
        'etc': {
            'hosts': '127.0.0.1 localhost\n192.168.1.1 router',
            'passwd': 'guest:x:1000:1000:Guest User,,,:/home/guest:/bin/bash',
        },
        'home': {},
        'opt': {
            'virtuality': {
                'data': {
                    'simulations': 'Simulation data of Virtuality project.',
                },
            },
        },
        'usr': {
            'local': {
                'games': {
                    'turing': 'Binary data of the Turing game.',
                },
            },
            'bin': {},
        },
        'var': {
            'log': {
                'syslog': '',
            },
            'tmp': {
                'tempfile': 'Temporary file data.',
            },
        },
        'lib': {
            'libreality.so': 'Binary data of the Reality library.',
        },
        'media': {
            'matrix.iso': 'Binary data of The Matrix ISO image.',
        },
        'mnt': {},
        'proc': {
            '1': {
                'cmdline': '/sbin/init',
                'status': 'Process 1 status data.',
            },
        },
        'root': {
            'admin': {
                'secret_project': 'Top secret project data.',
            },
        },
        'sys': {
            'kernel': {
                'debug': 'Kernel debug information.',
            },
        },
        'tmp': {},
    },
};

// Add default directories and files for a user
function addUserHome(username) {
    fileSystem['/']['home'][username] = {
        'Desktop': {},
        'Documents': {
            'README.md': 'This is the home directory of the user.',
        },
        'Downloads': {
            'tron.zip': 'Binary data of TRON game.',
            'neuromancer.pdf': 'Digital copy of Neuromancer by William Gibson.',
        },
        'Pictures': {
            'matrix.png': 'Binary data of an image from The Matrix.',
        },
        'Music': {},
        'Videos': {},
        'Templates': {},
        'Public': {},
        'scripts': {
            'holodeck.sh': '#!/bin/bash\necho "Entering the Holodeck..."',
        },
        'projects': {
            'andromeda': {
                'src': {
                    'main.c': '#include <stdio.h>\nint main() { printf("Hello, Andromeda!"); return 0; }',
                },
                'README.txt': 'Project Andromeda: Explore new frontiers in computing.',
            },
        },
    };
}
