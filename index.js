/* ab-web-spocky */


modules.exports = {

    _abLayouts: null,

    // buildLayout: function(layout_paths_array)
    // {
    //     var layout_paths = [];
    //
    //     for (var i = 0; i < layout_paths_array.length; i++) {
    //         for (var j = 0; j < layout_paths_array[i].length; j++) {
    //             var new_layout_path = layout_paths_array[i][j];
    //             if (this._layoutPaths.indexOf(new_layout_path) === -1)
    //                 continue;
    //
    //             if (layout_paths.indexOf(new_layout_path) !== -1)
    //                 continue;
    //
    //             layout_paths.push(new_layout_path);
    //         }
    //     }
    //
    //     for (var i = 0; i < layout_paths.length; i++)
    //         this.abLayouts.
    // },

    onCreate: function(tpl, tpl_info)
    {
        this._abLayouts = abLayouts.new(tpl.paths.front);
        this._layoutsWatcher = abWatcher.new();

        var self = this;
        this._layoutsWatcher
            .on([ 'add', 'unlink' ], function(file, evt) {
                self._tasks_BuildLayoutInfos()
                    .call();
            })
            .on([ 'add', 'unlink', 'change' ], function(file, evt) {
                self._tasks_BuildLayoutInfos()
                    .chainCall(self._tasks_BuildLayout(), file)
                    .call();
            });
    },

    onTplChanged: function(tpl, tpl_info)
    {
        self._layoutsWatcher.clear();

        if (!('spocky' in tpl_info))
            return;

        if ('layouts' in tpl_info.spocky)
            self._layoutsWatcher.update(tpl_info.spocky.layouts);
    },

    _tasks_BuildLayoutInfos: function(tpl)
    {
        return tpl.task('spocky.buildLayoutInfos', function(layouts_array) {
            var layouts = layouts_array.pop();

            tpl.log('Building layouts infos...')
            for (var i = 0; i < layouts.length; i++) {
                tpl.log('    - ', layouts[i]);
                // var layout_info = abLayouts.getLayoutInfo(layouts[i]);
                //
                // tpl.log(layout_info)
            }
        });
    },

    _tasks_BuildLayouts: function(tpl, file_path)
    {
        var layout_info = this._abLayouts.getLayoutInfo(file_path);

        return tpl.task('spocky.buildLayout.' + layout_info.name,
                function(layout_info_array) {
            tpl.log('Building layout:', layout_info.name + ':' + layout_info.path);
        });
        // self._abLayouts.build(file_path);
    }

}
