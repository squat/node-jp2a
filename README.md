# node-jp2a

node-jp2a is a node module for the [jp2a](http://csl.name/jp2a/) CLI tool. jp2a is a small utility that converts JPG images to ASCII. It's written in C and released under the [GPL](http://www.gnu.org/copyleft/gpl.html).

## Installation

Install with [npm](https://npmjs.org/):

    $ npm install jp2a

node-jp2a requires that the jp2a CLI tool be installed and available on the system's $PATH. The jp2a tool is a popular and widely available utility that should be avaiable in your system's package manager.

For example:

* on OS X you can install jp2a with [Homebrew](http://brew.sh/) by running: `$ brew install jp2a`

* on Ubuntu/Debian you can install jp2a with `apt-get`: `$ sudo apt-get install jp2a`

Please refer to the [jp2a](http://csl.name/jp2a/) documentation for help installing the tool.

## Example

````js
var jp2a = require( "jp2a" );

jp2a( [ "oktocat.jpg", "--width=50", "--background=light" ],  function( output ){
    console.log( output );
});

/*
               ..',,'..
          ,okXNNNNNNNNNNKkl,
       cONNNNNNNNNNNNNNNNNNNNO:
    .dNNNNNNNNNNNNNNNNNNNNNNNNNXo
   cXNNNK;:oONNNNNNNNNNNNOo:;XNNNX:
  xNNNNNc     '.     ..'     oNNNNNo
 dNNNNNNo                    xNNNNNNl
,NNNNNNk                      ONNNNNN.
xNNNNNN.                      .NNNNNNo
0NNNNNX                        NNNNNNk
kNNNNNN.                      ,NNNNNNd
:NNNNNNO                     .0NNNNNN,
 ONNNNNNKc.                .lXNNNNNNk
 .0NNd,l0NNKxo:        cokKNNNNNNNNO
   kNNN:.d0NNK;        lNNNNNNNNNNx
    ;KNNl.. ..         ,NNNNNNNN0,
      ,kNNX00K.        ,NNNNNNx'
         ;d0NN.        ,NN0o,
             .          .
*/
````
## API

### jp2a(options, callback(output))

node-jp2a expects two arguments, an options variable and a callback. The options variable can be a simple string containing a path to a local or remote jpg or it can be more complex and can be an array or hash of valid jp2a arguments. The only truly required argument is a file source.

Example with a string options argument and external file source:

````js
jp2a( "http://i1.sndcdn.com/artworks-000007199965-plnzsu-original.jpg", function( output ){
    console.log( output );
});

/*
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMKx:. 'OMMMMMMM
MMMMWlldkKNMMMMMMMMMMMMMMMMMMMMMMMMWOo,        ,NMMMMM
MMMW,       .,cok0NMMMMMMMMMMMMXxc.             .KMMMM
MMM;                ;XMMMMMMNl.                   KMMM
MMx                'WMMMMMMMMMO.                  .WMM
MW.                kMMMMKd;.:XMN                   lMM
Mx                 cMMc      .NW.                   NM
M:                  ,k0:      l'                    xM
M;                                                  :M
Mc                                                  ;M
M0                                                  lM
MM,                                                 KM
MMN.                     .lk0k:                    cMM
MMMN,                    KMMMMMd                  'WMM
MMMMMx                   0MMMMMW.                ,WMMM
MMMMMMWo.                'WMMMMM'               dMMMMM
MMMMMMMMMKo'              ;WMMMM.             :XMMMMMM
MMMMMMMMMMMMWKxc,.         'NMMK           .lNMMMMMMMM
MMMMMMMMMMMMMMMMMMMNX0OkxxxxKMM;        .:OWMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMk     .;dKMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMX,;lx0WMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
*/
````

Example with hash of options:

````js
jp2a( { src:"node.jpg", background:"light", colors: true }, function( output ){
    console.log( output );
});

/*
                                                    ;xN'
                                                  cWMMM'
        ..                 .                 .    xMMMW.        .
     'cx00Oo;.         .;oO0Od:.          'cx00xc.kMMMW.    .:x00Od:.
 .;dO000000000kl'   'ck000000000Oo,   .;dO00000kc.kMMMM..;oO000000000Ol,
OK0000Od:,lk0000KXO000000kl;cx00000KOO00000Od:.   xMMMMKK00000x:,cx0000KXo
KXXXO'      .lNWMMNXXXKc.     .,KNMMWXXXKd'       xMMMMNXXXK,  ... .:NWMMx
KXXXk        ;MMMMNXXXX.        NMMMWXXXXc        dMMMMNXXXK  ,,,,, .MMW0;
KXXXk        ;MMMMNXXXX.        NMMMWXXXXc        dMMMMNXXXK  ..''. .d,
KXXXO        ;MMMMNXXXXKx:.  ;xNMMMMWXXXXXkc.  .l0MMMMMNXXXXKx;.
,o0XO        ;MWOl,lOXXXXXXKWMMMMMXd;ckXXXXXX0NMMMMMWOl,lOXXXXXX'
   .,        .,      .;o0XXNMMNkc.      ,lOXXXMMMKo,      .;o0XX'
                         .:dl'             .;od;.             .:.
*/
````

#### Advanced

node-jp2a allows you to pipe file data directly into jp2a's STDIN rather than supply jp2a with a file path. This is useful in applications where you are generating or manipulating jpgs on the fly and do not want to save an image to the file system. To do this, set the `data` attribute in the options hash. It should be noted that `data` takes priority over `src`.

Example using STDIN:

````js
/* Use https://github.com/rsms/node-imagemagick to convert a png to a jpg. */
var im = require( "imagemagick" );

im.resize( {
    srcData: fs.readFileSync( "raspberrypi.png", "binary" ),
    width: 1000
}, function( err,stdout ){
    jp2a( { data: stdout, background: "light", width: 50, colors: true }, function( out ){
        console.log( out )
    });
});

/*
         :oX0XNkk:'           .,dx0W0X0c'
  .coKNWMNNKXKXNWWWkl.    ;dKWMXWKNKNNWMNNkl;
  OMXkdcllcccccclod0XMd .XW0OlocccccccollkOWM'
  KMKlcccloocccccccccOM0WNoccccccccloolcccxWM;
  cMWxccccclxkOdlcccccKMMocccccokOkdccccclKMN
   OMNoccccccclxKKklclXMMxccdOKOocccccccckMM'
    kMNxccccccccco0WXWMMMMNNNxcccccccccl0MW,
     ,NMXklcccccccxWMMMMMMMMKlcccccccdOWMx
       '0MNX0xkOKNMMMWNNNWMMMMX0OxkKNWNo.
       lXMNX0000WMXOxxxxxxxOXMN000KXWM0;
     .XMXkxxxxONMKxxxxxxxxxxx0MXkxxxxONM0
    .WM0xxxxONMMMMKOkxxxxxxk0WMMMXOxxxxXMK
    oMNxxOKWMNX000KNMWWWWWMX0OOO0XWW0kxkMM'
   'KMWNWMMXkxxxxxxxkXMMMWkxxxxxxxx0WMNXMM0,
 .0MW00WMMOxxxxxxxxxxxWMMOxxxxxxxxxxkWMNk0NMK.
'WM0xxxXMKxxxxxxxxxxxxNMMOxxxxxxxxxxx0M0xxx0MW.
KMKxxxxXMKxxxxxxxxxxxOMMMNxxxxxxxxxxxOMKxxxxXMO
WM0xxxxWMWkxxxxxxxxx0MMMMMWOxxxxxxxxkNMWxxxxKMK
xMNxxx0MMMMXOkxxkOKWWXKKKXNMWKOOkO0XMMMM0xxkWMc
 OMNO0MMMMMMMMMMMMKkxxxxxxxx0WMMMMMMWXKXNK0WMo
  dMMMKxxxOKWMMMMOxxxxxxxxxxxkWMMMXOxxxxxWMMc
   XMWxxxxxxx0WMWxxxxxxxxxxxxxXMWOxxxxxxxKMX
   'MMkxxxxxxxkWMOxxxxxxxxxxxkWWkxxxxxxxxNMx
    xMWkxxxxxxxOMMKkxxxxxxxkKWMOxxxxxxxxKMN.
     lWMKkxxxxxkMMMMWXKKKXNMMMMOxxxxxx0WMO.
      .oXMWXKKXWMMWXK000000KXWMWXKKXNMWx'
         .:OMMMMM0xxxxxxxxxxxxWMMMWO:.
             ,o0WWKkxxxxxxxkKWM0o'
                .lKMWNXXXNWMXd.
                   .o0NWWKd'
*/
````

## License

GPL
