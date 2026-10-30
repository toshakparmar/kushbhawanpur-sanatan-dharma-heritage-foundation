import { BadRequestException } from '@nestjs/common';
import { VideoProvider } from '@kushbhawanpur/shared';

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
}

export class VideoUrlParser {
  /**
   * Parses a video URL from allowed providers (YouTube, Vimeo, Facebook, Google Drive, direct mp4/webm).
   * Throws BadRequestException if URL is invalid or from an unsupported provider.
   */
  static parse(urlStr: string, allowedDomains: string[] = []): ParsedVideo {
    if (!urlStr || typeof urlStr !== 'string') {
      throw new BadRequestException('Video URL is required and must be a valid string.');
    }

    let url: URL;
    try {
      url = new URL(urlStr.trim());
    } catch {
      throw new BadRequestException('Invalid URL format. Please provide a complete URL starting with https://');
    }

    const host = url.hostname.toLowerCase();
    const pathname = url.pathname;

    // 1. YouTube
    if (
      host === 'youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtu.be'
    ) {
      let videoId = '';

      if (host === 'youtu.be') {
        videoId = pathname.slice(1).split('/')[0];
      } else if (pathname.startsWith('/watch')) {
        videoId = url.searchParams.get('v') || '';
      } else if (pathname.startsWith('/embed/')) {
        videoId = pathname.replace('/embed/', '').split('/')[0];
      } else if (pathname.startsWith('/shorts/')) {
        videoId = pathname.replace('/shorts/', '').split('/')[0];
      } else if (pathname.startsWith('/live/')) {
        videoId = pathname.replace('/live/', '').split('/')[0];
      }

      // Clean ID
      videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');

      if (!videoId || videoId.length < 5) {
        throw new BadRequestException(
          'Could not extract a valid YouTube video ID from the provided link. Playlist links must point to a specific video.',
        );
      }

      return {
        provider: VideoProvider.YOUTUBE,
        videoId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    // 2. Vimeo
    if (host === 'vimeo.com' || host === 'www.vimeo.com' || host === 'player.vimeo.com') {
      const match = pathname.match(/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      const videoId = match ? match[3] : pathname.split('/').filter(Boolean).pop();

      if (!videoId || !/^\d+$/.test(videoId)) {
        throw new BadRequestException('Could not extract a valid Vimeo video ID from the provided link.');
      }

      return {
        provider: VideoProvider.VIMEO,
        videoId,
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
        thumbnailUrl: '', // Will be updated or custom uploaded
      };
    }

    // 3. Google Drive
    if (host === 'drive.google.com') {
      const match = pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const videoId = match ? match[1] : url.searchParams.get('id') || '';

      if (!videoId) {
        throw new BadRequestException('Could not extract a valid Google Drive file ID.');
      }

      return {
        provider: VideoProvider.GOOGLE_DRIVE,
        videoId,
        embedUrl: `https://drive.google.com/file/d/${videoId}/preview`,
        thumbnailUrl: '',
      };
    }

    // 4. Facebook Video
    if (
      host === 'facebook.com' ||
      host === 'www.facebook.com' ||
      host === 'fb.watch' ||
      host === 'm.facebook.com'
    ) {
      const encoded = encodeURIComponent(url.toString());
      return {
        provider: VideoProvider.FACEBOOK,
        videoId: url.toString(),
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=0`,
        thumbnailUrl: '',
      };
    }

    // 5. Direct MP4 / WebM
    if (pathname.endsWith('.mp4') || pathname.endsWith('.webm') || pathname.endsWith('.ogg')) {
      return {
        provider: VideoProvider.DIRECT_MP4,
        videoId: pathname.split('/').pop() || 'direct_video',
        embedUrl: url.toString(),
        thumbnailUrl: '',
      };
    }

    // 6. Check custom allowed domains if configured
    if (allowedDomains.some((d) => host === d || host.endsWith(`.${d}`))) {
      return {
        provider: VideoProvider.OTHER,
        videoId: url.toString(),
        embedUrl: url.toString(),
        thumbnailUrl: '',
      };
    }

    throw new BadRequestException(
      `Unsupported video host: ${host}. Supported providers: YouTube, Vimeo, Facebook, Google Drive, or direct MP4/WebM files.`,
    );
  }
}
