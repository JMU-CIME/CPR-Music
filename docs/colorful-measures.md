# SVG
* svg z index is awful.
    * order in document determines stacking/z-index
* svgv2 maybe support z position
    * probably can't set it with css (and maybe not with js?)

# FlatIO
* there is a rect for the measure, but it's
    1. taller than necessary
    1. opacity 0 (we can change this even with css)
    1. above (z-index) the staff lines
    1. below the notes (this is probably good?)
    
## SVG structure
All of the below has tons of other things that aren't immediately 
* svg (first staff)
    * ...
        * g.scoreShard
            * g.scoreShard-content
                * g.systemContent
                    * g.staff
                        * g.staffLines
                        * g.measure
                        * g.measure...
* svg (second staff)
    * ...
        * g.scoreShard
            * g.scoreShard-content
                * g.systemContent
                    * g.staff
                        * g.staffLines
                        * g.measure
                        * g.measure...

## Approach
1. add a group to g.staff as its first child (so that it will be "under" [in terms of z-index] the staff lines)
    1. for each measure, add a rect to that group. possibly its bbox should be:
        * width: g.measure.getBBox().width
        * height: g.staffLines.getBBox().height
        * x: ?? look at how to find the current position of some reasonable related element using the javascript browser apis like clientTop getBoundingClientRect() ? https://stackoverflow.com/a/19203552/1449799 
        * y: ??

document.createElementNS('http://www.w3.org/2000/svg', 'rect')
https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
